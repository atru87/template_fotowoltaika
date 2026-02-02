// app/api/gallery/route.js
// Endpoint zarządzania galerią realizacji

import { NextResponse } from 'next/server';
import { getGallery, updateGallery } from '@/lib/dataManager';

// GET - pobierz galerię
export async function GET() {
  try {
    const gallery = await getGallery();
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
    
    const gallery = await getGallery();
    
    if (!gallery) {
      console.error('Failed to read gallery.json');
      return NextResponse.json(
        { error: 'Nie można wczytać galerii' },
        { status: 500 }
      );
    }
    
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
    
    const success = await updateGallery(gallery);
    
    if (!success) {
      console.error('Failed to save gallery.json');
      return NextResponse.json(
        { error: 'Nie można zapisać galerii - sprawdź uprawnienia do pliku data/gallery.json' },
        { status: 500 }
      );
    }
    
    console.log('Successfully added image:', newItem);
    return NextResponse.json({ success: true, item: newItem });
    
  } catch (error) {
    console.error('POST /api/gallery error:', error);
    return NextResponse.json(
      { error: `Błąd dodawania zdjęcia: ${error.message}` },
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
    
    const gallery = await getGallery();
    
    if (!gallery) {
      console.error('Failed to read gallery.json');
      return NextResponse.json(
        { error: 'Nie można wczytać galerii' },
        { status: 500 }
      );
    }
    
    const originalLength = gallery.items.length;
    gallery.items = gallery.items.filter(item => item.id !== id);
    
    if (gallery.items.length === originalLength) {
      console.warn(`Image with id ${id} not found`);
      return NextResponse.json(
        { error: 'Zdjęcie nie znalezione' },
        { status: 404 }
      );
    }
    
    const success = await updateGallery(gallery);
    
    if (!success) {
      console.error('Failed to save gallery.json');
      return NextResponse.json(
        { error: 'Nie można zapisać galerii - sprawdź uprawnienia do pliku data/gallery.json' },
        { status: 500 }
      );
    }
    
    console.log(`Successfully deleted image id: ${id}`);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('DELETE /api/gallery error:', error);
    return NextResponse.json(
      { error: `Błąd usuwania zdjęcia: ${error.message}` },
      { status: 500 }
    );
  }
}
