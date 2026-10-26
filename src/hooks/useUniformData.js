import { useState, useEffect } from "react";
import { UNIFORMS, UNIFORM_INFO } from "../data/uniformData";
// import { client } from "../lib/sanity";

export function useUniformData() {
  const [uniforms, setUniforms] = useState(UNIFORMS);
  const [info, setInfo] = useState(UNIFORM_INFO);
  const [status, setStatus] = useState("ready");
  const [error, setError] = useState(null);

  // SANITY CODE (Uncomment when ready)
  /*
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setStatus("loading");
      try {
        const uQuery = `*[_type == "uniform"]{ "key": gender + "-" + season, gender, season, "src": image.asset->url, "width": image.asset->metadata.dimensions.width, "height": image.asset->metadata.dimensions.height, alt, items[]{ "id": _key, name, note, x, y } }`;
        const iQuery = `*[_type == "uniformInfo"][0]`;
        
        const [uData, iData] = await Promise.all([client.fetch(uQuery), client.fetch(iQuery)]);
        if (!cancelled) {
          const formattedUniforms = {};
          uData.forEach(u => formattedUniforms[u.key] = u);
          setUniforms(Object.keys(formattedUniforms).length ? formattedUniforms : UNIFORMS);
          setInfo(iData || UNIFORM_INFO);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setStatus("error");
        }
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);
  */

  return { uniforms, info, status, error, retry: () => {} };
}