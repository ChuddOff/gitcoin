import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICode extends Document {
  _id: string;
  nick: string;
  deposit: number;
  bonus: boolean;
  pocket: object;
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
  pocket: {
    type: Object,
    required: true,
    unique: false,
  },
});

let code: Model<ICode>;
if (mongoose.models.profiles) {
  code = mongoose.model("profiles") as Model<ICode>; // Получаем существующую модель
} else {
  console.log(12122);

  code = mongoose.model<ICode>("profiles", SchemaCode); // Создаем новую модель, если ее нет
}

export default code;
