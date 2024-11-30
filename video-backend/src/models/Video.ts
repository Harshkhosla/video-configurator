import mongoose, { Schema, Document } from 'mongoose';


interface IAnnotation {
  type: 'question' | 'prompt' | 'feedback';  
  content: string; 
  timestamp: number;  
  answered?: boolean;  
}

interface IVideo extends Document {
  fileUrl: string;  
  annotations: IAnnotation[];  
}

const AnnotationSchema: Schema = new Schema({
  type: { type: String, enum: ['question', 'prompt', 'feedback'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Number, required: true },
  answered: { type: Boolean, default: false },
}, { timestamps: true });


const VideoSchema: Schema = new Schema({
  fileUrl: { type: String, required: true },  
  annotations: { type: [AnnotationSchema], default: [] },  
}, { timestamps: true });

const Video = mongoose.model<IVideo>('Video', VideoSchema);

export { Video, IAnnotation, IVideo };
