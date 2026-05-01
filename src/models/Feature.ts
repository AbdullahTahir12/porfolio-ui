import { HydratedDocument, InferSchemaType, Schema, model, models } from "mongoose";

const FeatureSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export type FeatureDocument = HydratedDocument<InferSchemaType<typeof FeatureSchema>>;

const FeatureModel = models.Feature || model("Feature", FeatureSchema);

export default FeatureModel;