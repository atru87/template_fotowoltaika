'use client';
import { useSearchParams } from 'next/navigation';

export function WithTemplateId({ children }) {
  const searchParams = useSearchParams();
  const templateId = searchParams?.get('template') || 'fotowoltaika';
  
  return children(templateId);
}
