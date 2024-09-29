import { createClient } from "@supabase/supabase-js";

const bucket = "main-bucket"; //name of supabase bucket here

// Creates a single supabase client for interacting with the database
export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export const uploadImage = async (image: File) => {
  const timestamp = Date.now();
  const newName = `${timestamp}-${image.name}`;
  const { data } = await supabase.storage
    .from(bucket)
    .upload(newName, image, { cacheControl: "3600" });
  if (!data) {
    throw new Error("image upload failed");
  }
  return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
};
