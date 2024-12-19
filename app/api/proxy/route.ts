import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://www.gutenberg.org/cache/epub/100/pg100.txt');
        const text = await response.text();
        return new NextResponse(text, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    } catch (error) {
        return new NextResponse('Error fetching text', { status: 500 });
    }
} 