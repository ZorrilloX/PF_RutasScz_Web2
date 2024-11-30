import { Test, TestingModule } from "@nestjs/testing";
import { IncidentesController } from "./incidentes.controller";

describe("IncidentesController", () => {
    let controller: IncidentesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [IncidentesController],
        }).compile();

        controller = module.get<IncidentesController>(IncidentesController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
