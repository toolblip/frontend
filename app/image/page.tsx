import { redirect } from 'next/navigation';
import { IMAGE_CATEGORY_PATH } from '@/lib/tool-path';

export default function ImageAliasPage() {
  redirect(IMAGE_CATEGORY_PATH);
}
