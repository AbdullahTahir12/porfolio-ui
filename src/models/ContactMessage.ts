import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
  models,
} from "mongoose";

const ContactMessageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    channel: {
      type: String,
      enum: ["contact-form", "whatsapp"],
      default: "contact-form",
    },
    status: {
      type: String,
      enum: ["new", "read"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

ContactMessageSchema.path("email").validate(
  function validateEmail(
    this: InferSchemaType<typeof ContactMessageSchema>,
    value: string | undefined
  ) {
    if (value?.length) {
      return true;
    }

    return Boolean(this.phone && this.phone.length);
  },
  "Provide an email address or phone number."
);

export type ContactMessageDocument = HydratedDocument<
  InferSchemaType<typeof ContactMessageSchema>
>;

export const ContactMessageModel =
  models.ContactMessage || model("ContactMessage", ContactMessageSchema);

export default ContactMessageModel;
