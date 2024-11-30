import { Test, TestingModule } from "@nestjs/testing";
import { ImagenesService } from "./imagen-service.service";

describe("ImagenServiceService", () => {
    let service: ImagenesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ImagenesService],
        }).compile();

        service = module.get<ImagenesService>(ImagenesService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
