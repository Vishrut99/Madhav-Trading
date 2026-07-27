import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { config } from '@/lib/config';

export const runtime = 'nodejs';

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. List all existing buckets
  const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
  results.buckets = buckets?.map((b) => b.name) ?? null;
  results.bucketsError = bucketsErr ?? null;

  // 2. Try uploading a tiny test file into the bucket
  const testPath = `_debug/test-${Date.now()}.txt`;
  const testBuffer = Buffer.from('hello');
  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from(config.storageBucket)
    .upload(testPath, testBuffer, { contentType: 'text/plain', upsert: true });
  results.bucket = config.storageBucket;
  results.uploadPath = testPath;
  results.uploadData = uploadData ?? null;
  results.uploadError = uploadErr ?? null;

  // 3. Clean up
  if (!uploadErr) {
    await supabase.storage.from(config.storageBucket).remove([testPath]);
    results.cleanedUp = true;
  }

  return NextResponse.json(results, { status: 200 });
}
