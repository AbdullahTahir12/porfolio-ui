import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
  models,
} from "mongoose";

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
    },
    gallery: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
    },
    repoUrl: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
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

export type ProjectDocument = HydratedDocument<
  InferSchemaType<typeof ProjectSchema>
>;

export const ProjectModel =
  models.Project || model("Project", ProjectSchema);

export default ProjectModel;
