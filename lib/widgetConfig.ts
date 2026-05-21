
export type AssetType = "product" | "offer" | "generic";

export type WidgetFieldConfig = {
  name: string;
  label: string;
  assetTypes: AssetType[];
};

export const AVAILABLE_FIELDS: WidgetFieldConfig[] = [
  { name: "name", label: "Name", assetTypes: ["product","offer","generic"] },
  { name: "image_url", label: "Image", assetTypes: ["product","offer"] },
  { name: "price", label: "Price", assetTypes: ["product"] },
  { name: "description", label: "Description", assetTypes: ["product","offer"] },
  { name: "categories", label: "Categories", assetTypes: ["product","offer"] },
  { name: "keywords", label: "Keywords", assetTypes: ["product","offer"] },
  { name: "nutricion_calorias_kcal", label: "Calories", assetTypes: ["product"] },
  { name: "informacion_alergenos_lista", label: "Allergens", assetTypes: ["product"] }
];
