import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICode extends Document {
  name: string;
  description: string;
  show: boolean;
  author: string;
  html: string;
  css: string;
  js: string;
}

const SchemaCode: Schema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: false,
  },
  nick: {
    type: String,
    required: true,
    unique: false,
  },
  deposit: {
    type: Number,
    required: true,
    unique: false,
  },
  bonus: {
    type: Boolean,
    required: true,
    unique: false,
  },
});

let code: Model<ICode>;
if (mongoose.models.codes) {
  code = mongoose.model("profile") as Model<ICode>; // Получаем существующую модель
} else {
  code = mongoose.model<ICode>("profile", SchemaCode); // Создаем новую модель, если ее нет
}

export default code;
