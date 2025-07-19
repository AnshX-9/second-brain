import mongoose, {Model, Schema} from "mongoose";
import  dotenv from 'dotenv'



dotenv.config()


async function connectMongoose(): Promise<void> {
  try {
    await mongoose.connect(process.env.DATABASE_URL || '');
    console.log('Database connected successfully');
  } catch (e) {
    console.error('Database connection error:', e);
  }
}


connectMongoose();

const UserScheMa =  new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
})

const ContentSchema = new Schema({
  title: {type: String,  required: true},
  link: {type: String,  required: true},
  tag: {type: mongoose.Types.ObjectId,  ref: 'Tag'},
  userId: {type: mongoose.Types.ObjectId, ref: 'User' , required: true}, 
  authorId: {type: mongoose.Types.ObjectId, ref: 'User',  required: true}
  
})

export const ContentModel = mongoose.model("Content", ContentSchema);
export const UserModel =  mongoose.model("User", UserScheMa);
