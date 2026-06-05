import { getPublicAssetDetails } from '@/actions/public';
import { notFound } from 'next/navigation';
import AssetDetailClient from './AssetDetailClient';

interface AssetPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AssetPage({ params }: AssetPageProps) {
  const { id } = await params;
  const asset = await getPublicAssetDetails(id);

  if (!asset) {
    notFound();
  }

  return <AssetDetailClient asset={asset} />;
}
