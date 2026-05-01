import { HydratedDocument, InferSchemaType, Schema, model, models } from "mongoose";

const SkillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },
    iconUrl: {
      type: String,
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

export type SkillDocument = HydratedDocument<InferSchemaType<typeof SkillSchema>>;

export const SkillModel = models.Skill || model("Skill", SkillSchema);

export default SkillModel;
