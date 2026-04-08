import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

interface UploadedFile {
  url: string;
  publicId: string;
}

interface ApiResponse {
  files?: UploadedFile[];
  error?: string;
  result?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];
    
    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file: File) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "sustainify" },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error: any, result: any) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result as CloudinaryUploadResponse);
            } else {
              reject(new Error("No result from upload"));
            }
          }
        );
        
        uploadStream.end(buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    
    const uploadedFiles: UploadedFile[] = results.map((result: CloudinaryUploadResponse) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    return NextResponse.json({ files: uploadedFiles });
  } catch (error: unknown) {
    console.error("Cloudinary upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to upload to Cloudinary";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Remove image from Cloudinary by public_id
export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const { publicId } = body as { publicId?: string };

    if (!publicId) {
      return NextResponse.json({ error: "No public_id provided" }, { status: 400 });
    }

    return new Promise<NextResponse<ApiResponse>>((resolve) => {
      cloudinary.uploader.destroy(
        publicId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error: any, result: any) => {
          if (error) {
            console.error("Cloudinary delete error:", error);
            resolve(NextResponse.json({ error: error.message }, { status: 500 }));
          } else {
            // Cloudinary returns { result: 'ok' } or { result: 'not found' } etc.
            resolve(NextResponse.json({ result: result?.result || "deleted" }));
          }
        }
      );
    });
  } catch (error: unknown) {
    console.error("Delete request error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete image";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
