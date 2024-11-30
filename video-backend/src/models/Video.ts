import mongoose, { Schema, Document } from 'mongoose';

// Annotation schema to store details like type, content, and timestamp
interface IAnnotation {
  type: 'question' | 'prompt' | 'feedback';  // Type of annotation (question, prompt, feedback)
  content: string;  // Content of the annotation
  timestamp: number;  // Timestamp when the annotation should appear (in seconds)
  answered?: boolean;  // Optional field to track if a question was answered
}

// Video schema to store the file URL and associated annotations
interface IVideo extends Document {
  fileUrl: string;  // URL of the uploaded video
  annotations: IAnnotation[];  // Array of annotations attached to the video
}

// Annotation schema definition
const AnnotationSchema: Schema = new Schema({
  type: { type: String, enum: ['question', 'prompt', 'feedback'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Number, required: true },
  answered: { type: Boolean, default: false },
}, { timestamps: true });

// Video schema definition
const VideoSchema: Schema = new Schema({
  fileUrl: { type: String, required: true },  // URL to the video file
  annotations: { type: [AnnotationSchema], default: [] },  // List of annotations for the video
}, { timestamps: true });

// Create the Video model using the schema
const Video = mongoose.model<IVideo>('Video', VideoSchema);

export { Video, IAnnotation, IVideo };
