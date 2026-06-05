import { getPublicAssetDetails } from '@/actions/public';
import { notFound } from 'next/navigation';
import AssetDetailClient from './AssetDetailClient';

interface AssetPageProps {
  params: {
    id: string;
  };
}

export default async function AssetPage({ params }: AssetPageProps) {
  const asset = await getPublicAssetDetails(params.id);

  if (!asset) {
    notFound();
  }

  return <AssetDetailClient asset={asset} />;
}
