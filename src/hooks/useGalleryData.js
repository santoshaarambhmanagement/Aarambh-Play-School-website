import { useState, useEffect, useCallback } from "react";
import { MOCK_GALLERY } from "../data/galleryData";
import { client } from "../lib/sanity";

export function useGalleryData() {
  const [items, setItems] = useState(MOCK_GALLERY);
  const [status, setStatus] = useState("ready"); // "loading" | "ready" | "error"
  const [error, setError] = useState(null);

  const fetchGallery = useCallback(async () => {
    // SANITY IMPLEMENTATION (UNCOMMENT LATER)
    
    let cancelled = false;
    setStatus("loading");
    try {
      const query = `*[_type == "galleryImage"] | order(date desc, _createdAt desc){ "id": _id, "url": image.asset->url, "lqip": image.asset->metadata.lqip, "width": image.asset->metadata.dimensions.width, "height": image.asset->metadata.dimensions.height, alt, caption, category }`;
      const data = await client.fetch(query);
      if (!cancelled) {
        setItems(data);
        setStatus("ready");
      }
    } catch (err) {
      if (!cancelled) {
        setError(err);
        setStatus("error");
        setItems(MOCK_GALLERY); // Fallback
      }
    }
    return () => { cancelled = true; };
    
  }, []);

  useEffect(() => {
     fetchGallery();
  }, [fetchGallery]);

  return { items, status, error, retry: fetchGallery };
}