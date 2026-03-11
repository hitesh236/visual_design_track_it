import rawData from '@/data/ItineraryFull.json';
import { Layers, Columns, List } from 'lucide-react';

export type Mood = 'nature' | 'luxury' | 'adventure' | 'modern' | 'spiritual';
export const moods: Mood[] = ['nature', 'luxury', 'adventure', 'modern', 'spiritual'];

export type Layout = 'stacked' | 'split' | 'compact';
export const layouts: { id: Layout; name: string; icon: React.ElementType }[] = [
  { id: 'stacked', name: 'Stacked', icon: Layers },
  { id: 'split', name: 'Split', icon: Columns },
  { id: 'compact', name: 'Compact', icon: List },
];


export interface ItineraryComponent {
    component_type: string;
    name: string;
    description?: string | null;
    rating?: number;
    location?: string;
    address?: string;
    mealPlan?: string;
    roomType?: string;
    images?: string[];
    departure?: string;
    arrival?: string;
    price?: number;
    pickupLocation?: string;
    dropLocation?: string;
    cabCategoryName?: string;
    flightNo?: string;
    airline?: string;
    trainName?: string;
    trainNo?: string;
    busOperator?: string;
    from_code?: string;
    to_code?: string;
    passenger_name?: string;
    gate?: string;
    terminal?: string;
    seatNumber?: string;
    baggage?: string;
    cabinBaggage?: string;
    fareClass?: string;
}

export interface Day {
    day_number: number;
    title: string;
    date: string;
    components: ItineraryComponent[];
}

export interface Itinerary {
    title: string;
    feature_image: string;
    final_price: string;
    travelers: { adults: number; children: number; minors: number };
    tour_start_date: string;
    tour_end_date: string;
    greeting_message: string;
    inquiry: { client_name: string; inquiry_id: string };
    package_type?: string;
    days: Day[];
    info_sections: { title: string; content: string; icon: string }[];
    pricing_breakdown: { item_name: string; item_type: string; day_number: number; price: number }[];
}

function transformData(rawData: any): Itinerary {
    const source = rawData.data.data;

    const daysMap: Map<number, Day> = new Map();

    source.components.forEach((comp: any) => {
        let day = daysMap.get(comp.day_number);
        if (!day) {
            day = {
                day_number: comp.day_number,
                title: comp.daywise_title || `Day ${comp.day_number}`,
                date: comp.date,
                components: [],
            };
            daysMap.set(comp.day_number, day);
        }
        
        const component: ItineraryComponent = {
            component_type: comp.component_type,
            name: comp.name,
            description: comp.description,
            price: parseFloat(comp.price) || undefined,
            rating: parseInt(comp.rating, 10) || undefined,
            location: comp.location || undefined,
            address: comp.address || undefined,
            images: comp.images?.map((img: any) => img.url) || [],
            mealPlan: comp.details?.mealPlan,
            roomType: comp.details?.roomType,
            departure: comp.details?.segments?.[0]?.departure || comp.details?.departureDateTime,
            arrival: comp.details?.segments?.[0]?.arrival || comp.details?.arrivalDateTime,
            pickupLocation: comp.details?.pickupLocation,
            dropLocation: comp.details?.dropLocation,
            cabCategoryName: comp.details?.cabCategoryName,
            flightNo: comp.details?.segments?.[0]?.flightNo,
            airline: comp.details?.airline_name,
            trainName: comp.details?.trainName,
            trainNo: comp.details?.trainNo,
            busOperator: comp.details?.busOperator,
        };

        if (comp.component_type === 'Flight') {
            const segment = comp.details?.segments?.[0];
            const getAirportCode = (name: string = '') => {
                if (!name) return 'NA';
                if (name.includes('Indira Gandhi') || name.includes('Delhi')) return 'DEL';
                if (name.includes('Kushok Bakula')) return 'IXL';
                const code = name.match(/\(([^)]+)\)/);
                if (code) return code[1];
                return name.substring(0, 3).toUpperCase();
            }
    
            component.from_code = getAirportCode(segment?.from);
            component.to_code = getAirportCode(segment?.to);
            component.passenger_name = source.inquiry.client_name || 'NA';
            
            const flightNoInt = parseInt(segment?.flightNo?.replace(/\D/g, '') || '0', 10);
            component.gate = `A${(flightNoInt % 18) + 1}`;
            component.terminal = `T${((flightNoInt % 3) + 1)}`;
            
            component.seatNumber = segment?.seatNumber || 'NA';
            component.baggage = segment?.baggage || 'NA';
            component.cabinBaggage = segment?.cabinBaggage || 'NA';
            component.fareClass = comp.details?.fareClass ? 'Business' : 'Economy';
        }

        day.components.push(component);
    });

    const sortedDays = Array.from(daysMap.values()).sort((a, b) => a.day_number - b.day_number);

    return {
        title: source.title,
        feature_image: source.feature_image,
        final_price: source.final_price,
        travelers: source.travelers,
        tour_start_date: sortedDays.length > 0 ? sortedDays[0].date : source.tour_start_date,
        tour_end_date: sortedDays.length > 0 ? sortedDays[sortedDays.length - 1].date : source.tour_end_date,
        greeting_message: source.greeting_message,
        package_type: source.package_type,
        inquiry: {
            client_name: source.inquiry.client_name,
            inquiry_id: source.inquiry.inquiry_id,
        },
        days: sortedDays,
        info_sections: source.info_sections.map((s:any) => ({ title: s.title, content: s.content, icon: s.icon })),
        pricing_breakdown: source.pricing_breakdown.map((p: any) => ({
            item_name: p.item_name,
            item_type: p.item_type,
            day_number: p.day_number,
            price: parseFloat(p.price),
        })),
    };
}

export const processedItinerary = transformData(rawData);
