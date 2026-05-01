import { HydratedDocument, InferSchemaType, Schema, model, models } from "mongoose";

const SiteIdentitySchema = new Schema(
  {
    brandName: {
      type: String,
      required: true,
      trim: true,
    },
    brandTagline: {
      type: String,
      trim: true,
    },
    brandDescription: {
      type: String,
      trim: true,
    },
    brandLogoUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export type SiteIdentityDocument = HydratedDocument<InferSchemaType<typeof SiteIdentitySchema>>;

const SiteIdentityModel = models.SiteIdentity || model("SiteIdentity", SiteIdentitySchema);

export default SiteIdentityModel;