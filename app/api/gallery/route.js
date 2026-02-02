// app/api/gallery/route.js
// Endpoint zarządzania galerią realizacji

import { NextResponse } from 'next/server';
import { getGallery, updateGallery } from '@/lib/dataManager';

// GET - pobierz galerię
export async function GET() {
  try {
    const gallery = getGallery();
    return NextResponse.json(gallery);
  } catch (error) {
    return NextResponse.json(
      { error: 'Błąd pobierania galerii' },
      { status: 500 }
    );
  }
}

// POST - dodaj zdjęcie
export async function POST(request) {
  try {
    const { url, alt } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL jest wymagany' },
        { status: 400 }
      );
    }
    
    const gallery = getGallery();
    const newId = gallery.items.length > 0 
      ? Math.max(...gallery.items.map(item => item.id)) + 1 
      : 1;
    
    const newItem = {
      id: newId,
      url,
      alt: alt || 'Realizacja',
      date: new Date().toISOString().split('T')[0]
    };
    
    gallery.items.push(newItem);
    updateGallery(gallery);
    
    return NextResponse.json({ success: true, item: newItem });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Błąd dodawania zdjęcia' },
      { status: 500 }
    );
  }
}

// DELETE - usuń zdjęcie
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID jest wymagane' },
        { status: 400 }
      );
    }
    
    const gallery = getGallery();
    gallery.items = gallery.items.filter(item => item.id !== id);
    updateGallery(gallery);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Błąd usuwania zdjęcia' },
      { status: 500 }
    );
  }
}
