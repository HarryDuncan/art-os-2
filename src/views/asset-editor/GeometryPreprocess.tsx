import { useCallback } from "react";
import { handleExportClick } from "./export/exportAsObj";
import { extractMetadata } from "./geometry/extract-metadata/extractMetadata";
import { downloadJsonFile } from "./export/downloadJson";
import { setSameVertexCount } from "./geometry/vertex/setSameVertexCount";
import { addAdditionalVerticies } from "./geometry/vertex/add-shapes/addAdditionalVertices";
import { preTransformGeometry } from "./pre-transform/preTransform";
import { Asset } from "art-os-package/src/assets/asset.types";
import { useAssets } from "art-os-package";
import { getAssetBufferGeometry } from "art-os-package/src/config/mesh/geometry/getAssetGeometries";
import { Container } from "views/Container";

const preTransformConfig = {
  centerGeometry: true,
};

const ASSETS = [
  {
    id: "jizz",
    name: "jizz",
    url: "../assets/models/Jizz.obj",
    assetType: "MODEL3D",
  },
  {
    id: "barba",
    name: "barba",
    url: "../assets/models/barba.obj",
    assetType: "MODEL3D",
  },
];

export const GeometryPreprocess = () => {
  const assets = ASSETS;
  const { initializedAssets, areAssetsInitialized } = useAssets(
    assets as Asset[]
  );

  const sameVertices = useCallback(() => {
    console.log(initializedAssets);
    const preTransformed = preTransformGeometry(
      initializedAssets,
      preTransformConfig
    );
    const assetMetaData = extractMetadata(preTransformed);

    const maxVertexCount = Math.max(
      ...assetMetaData.map(({ metaData }) => metaData?.vertexCount ?? 0)
    );
    const transformedGeometry = preTransformed.flatMap((asset, index) => {
      const bufferGeometry = getAssetBufferGeometry(asset);
      if (bufferGeometry) {
        const { metaData } = assetMetaData[index];
        if (!metaData) {
          console.warn(`no metadata found for ${asset.name}`);
          return [];
        }

        const originalBufferGeometry = getAssetBufferGeometry(
          initializedAssets[index]
        );

        return setSameVertexCount(
          bufferGeometry,
          originalBufferGeometry,
          maxVertexCount
        );
      }
      console.warn(`no buffer geometry found for ${asset.name}`);
      return [];
    });
    transformedGeometry.forEach(async (transformed, index) => {
      const fileName = initializedAssets[index].name;
      const geometryId = initializedAssets[index].id;
      await handleExportClick(transformed, geometryId, fileName);
    });
  }, [initializedAssets]);
  const addVertices = useCallback(() => {
    const preTransformed = preTransformGeometry(
      initializedAssets,
      preTransformConfig
    );
    const assetMetaData = extractMetadata(preTransformed);

    const transformedGeometry = preTransformed.flatMap((asset, index) => {
      const bufferGeometry = getAssetBufferGeometry(asset);
      if (bufferGeometry) {
        const { metaData } = assetMetaData[index];
        if (!metaData) {
          console.warn(`no metadata found for ${asset.name}`);
          return [];
        }

        const originalBufferGeometry = getAssetBufferGeometry(
          initializedAssets[index]
        );

        return addAdditionalVerticies(bufferGeometry, originalBufferGeometry);
      }
      console.warn(`no buffer geometry found for ${asset.name}`);
      return [];
    });
    transformedGeometry.forEach(async (transformed, index) => {
      const fileName = initializedAssets[index].name;
      const geometryId = initializedAssets[index].id;
      await handleExportClick(transformed, geometryId, fileName);
    });
  }, [initializedAssets]);

  const extractAssetMetadata = () => {
    const updatedAssetData = extractMetadata(initializedAssets);
    downloadJsonFile(updatedAssetData, `asset-data`);
  };

  const formatToSpec = useCallback(() => {
    const preTransformed = preTransformGeometry(
      initializedAssets,
      preTransformConfig
    );
    const assetMetaData = extractMetadata(preTransformed);
    const transformedGeometry = preTransformed.flatMap((asset, index) => {
      const bufferGeometry = getAssetBufferGeometry(asset);
      if (bufferGeometry) {
        const { metaData } = assetMetaData[index];
        if (!metaData) {
          console.warn(`no metadata found for ${asset.name}`);
          return [];
        }
        return getAssetBufferGeometry(initializedAssets[index]);
      }
      console.warn(`no buffer geometry found for ${asset.name}`);
      return [];
    });
    transformedGeometry.forEach(async (transformed, index) => {
      const fileName = initializedAssets[index].name;
      const geometryId = initializedAssets[index].id;
      await handleExportClick(transformed, geometryId, fileName);
    });
  }, [initializedAssets]);

  return (
    <Container>
      <h1>Geometry Preprocess</h1>
      <h1>Assets Initialized : {areAssetsInitialized ? "yes" : "no"} </h1>
      <h1>Assets : {initializedAssets.map(({ name }) => `${name} `)} </h1>
      <h2>Same Vertices</h2>
      <button
        type="button"
        onClick={sameVertices}
        disabled={!areAssetsInitialized}
      >
        Same Vertices
      </button>
      <button
        type="button"
        onClick={formatToSpec}
        disabled={!areAssetsInitialized}
      >
        Format To Spec
      </button>
      <button
        type="button"
        onClick={addVertices}
        disabled={!areAssetsInitialized}
      >
        add Vertices
      </button>
      <h2>Extract Metadata</h2>
      <button
        type="button"
        onClick={extractAssetMetadata}
        disabled={!areAssetsInitialized}
      >
        Extract Metadata
      </button>
    </Container>
  );
};
