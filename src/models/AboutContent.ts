import { HydratedDocument, InferSchemaType, Schema, model, models } from "mongoose";

const AboutContentSchema = new Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    paragraphs: {
      type: [String],
      default: [],
    },
    resumeLabel: {
      type: String,
      required: true,
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: true,
      trim: true,
    },
    secondaryLabel: {
      type: String,
      trim: true,
    },
    secondaryUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export type AboutContentDocument = HydratedDocument<InferSchemaType<typeof AboutContentSchema>>;

const AboutContentModel = models.AboutContent || model("AboutContent", AboutContentSchema);

export default AboutContentModel;
