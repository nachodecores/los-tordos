import {notFound} from 'next/navigation';
import HeroPhotoEditor from '@/components/public/HeroPhotoEditor';
import './photo-editor.css';

export const metadata = {title: 'Editor local de fotos · Los Tordos', robots: {index: false, follow: false}};
export const dynamic = 'force-dynamic';

export default function PhotoEditorPage() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return <HeroPhotoEditor/>;
}
