import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

export function UploadImage() {
    return applyDecorators(
        UseInterceptors(
            FileInterceptor("image", {
                storage: diskStorage({
                    destination: "./uploads", // Ruta de destino
                    filename: (req, file, cb) => {
                        // Configuración del nombre del archivo
                        cb(null, `${Date.now()}-${file.originalname}`);
                    },
                }),
            }),
        ),
    );
}
