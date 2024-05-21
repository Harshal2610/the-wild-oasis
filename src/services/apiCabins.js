import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new error("Cabins cannot be found");
  }
  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  // here basically we are creating the URL of the image we need to upload to the storage bucket in supabase

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-image/${imageName}`;

  // 1. Creating/edting the cabin
  let query = supabase.from("cabins");

  // creating
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // edtitng
  if (id)
    query = query
      .update({ ...newCabin, image: imagePath })
      .eq("id", id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new error("Cabins cannot be created");
  }

  // 2. Uploadig the image
  if (hasImagePath) return data;
  const { error: storageError } = await supabase.storage
    .from("cabin-image")
    .upload(imageName, newCabin.image);
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new error("Cabins image cannot be uploaded and cabin is not created");
  }
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new error("Cabins cannot be deleted");
  }

  return data;
}
