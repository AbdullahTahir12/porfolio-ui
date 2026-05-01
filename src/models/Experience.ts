import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
  models,
} from "mongoose";

const ExperienceSchema = new Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    achievements: {
      type: [String],
      default: [],
    },
    techStack: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export type ExperienceDocument = HydratedDocument<
  InferSchemaType<typeof ExperienceSchema>
>;

export const ExperienceModel =
  models.Experience || model("Experience", ExperienceSchema);

export default ExperienceModel;
