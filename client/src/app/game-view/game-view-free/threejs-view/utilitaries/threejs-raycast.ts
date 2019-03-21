import * as THREE from "three";
import { ActionType, ISceneObjectUpdate } from "../../../../../../../common/communication/iGameplay";
import { ThreejsGenerator } from "./threejs-generator";

export class ThreejsRaycast {

    private readonly MULTIPLICATOR: number = 2;

    private renderer:           THREE.WebGLRenderer;
    private camera:             THREE.PerspectiveCamera;
    private scene:              THREE.Scene;
    private idBySceneId:        Map<number, number>;
    private threejsGenerator:   ThreejsGenerator;

    public constructor(
        camera: THREE.PerspectiveCamera,
        renderer: THREE.WebGLRenderer,
        scene: THREE.Scene) {
        this.camera   = camera;
        this.renderer = renderer;
        this.scene    = scene;
    }

    public setMaps(idBySceneId: Map<number, number>): void {
        this.idBySceneId = idBySceneId;
    }

    public setThreeGenerator(threejsGenerator: ThreejsGenerator): void {
        this.threejsGenerator = threejsGenerator;
    }

    public detectObject(mouseEvent: MouseEvent): number {
        mouseEvent.preventDefault();

        const mouse: THREE.Vector3 = new THREE.Vector3();
        const raycaster: THREE.Raycaster = new THREE.Raycaster();

        mouse.x =   ( mouseEvent.offsetX / this.renderer.domElement.clientWidth ) * this.MULTIPLICATOR - 1;
        mouse.y = - ( mouseEvent.offsetY / this.renderer.domElement.clientHeight ) * this.MULTIPLICATOR + 1;
        mouse.z = 0;

        raycaster.setFromCamera(mouse, this.camera);

        const objectsIntersected: THREE.Intersection[] = raycaster.intersectObjects(this.scene.children);

        if (objectsIntersected.length > 0) {
          const firstIntersectedId: number = objectsIntersected[0].object.id;

          return this.idBySceneId.get(firstIntersectedId) as number;
        }

        return -1;
    }

    public updateSceneWithNewObject(object: ISceneObjectUpdate): void {

        if (!object.sceneObject) {
            return;
        }

        switch (object.actionToApply) {

            case ActionType.ADD:
              this.threejsGenerator.initiateObject(object.sceneObject);
              break;

            case ActionType.DELETE:
              this.threejsGenerator.deleteObject(object.sceneObject.id);
              break;

            case ActionType.CHANGE_COLOR:
              this.threejsGenerator.changeObjectColor(object.sceneObject.id, object.sceneObject.color);
              break;

            default:
              break;
          }
    }

}
