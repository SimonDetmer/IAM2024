/**
 * @author Jörn Kreutel
 */
import {mwf} from "vfh-iam-mwf-base";
import {mwfUtils} from "vfh-iam-mwf-base";
import * as entities from "../model/MyEntities.js";
import {checkNoUnwrappedItemOptionPairs} from "@babel/core/lib/config/validation/options";

export default class EditviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    // TODO-REPEATED: declare custom instance attributes for this controller

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        this.mediaItem = this.args?.item || new entities.MediaItem();

        // instantiate the template for the view
        this.viewProxy = this.bindElement("myapp-mediaEditviewTemplate", {item: this.mediaItem}, this.root).viewProxy;

        this.viewProxy.bindAction("deleteItem",(() => {
            this.mediaItem.delete().then(() => {
                this.previousView({deletedItem:this.mediaItem}, "itemDeleted");
            })
        }));

        if (!this.args?.item) {
            const deleteElement = this.root.querySelector("#deleteButton")
            if (deleteElement) {
                deleteElement.disabled = true
            }
        }

        // TODO: do databinding, set listeners, initialise the view
        this.editviewForm = this.root.querySelector("main form");

        this.editviewForm.srcimg.onchange = () => {
            const fileObjecturl = URL.createObjectURL(this.editviewForm.srcimg.files[0]);
            this.mediaItem.src = fileObjecturl;
            this.viewProxy.update({item: this.mediaItem});
        }

        this.editviewForm.onsubmit = () => {
            if (this.editviewForm.srcimg.files[0]) {
                // 1. upload the selected image to the server
                const requestObj = new XMLHttpRequest();
                const baseUrl = "http://127.0.0.1:7077";
                const uploadUrl = baseUrl + "/api/upload";

                requestObj.open("POST",uploadUrl);
                const dataToBeUploaded = new FormData();
                dataToBeUploaded.append("imgdata",this.editviewForm.srcimg.files[0]);
                requestObj.send(dataToBeUploaded);
                // 2. obtain the URL for the referencing the uploaded image on the server
                requestObj.onload = () => {
                    if (requestObj.status === 200) {
                        const responseData = JSON.parse(requestObj.responseText);
                        console.log("responseData: ", responseData);
                        const uploadedImgRelativeUrl = responseData.data.imgdata;
                        // 3. use the URL as src attribute if the media item to be created or updated
                        this.mediaItem.src = baseUrl + "/" + uploadedImgRelativeUrl;
                        // 4. create or update the mediaItem
                        this.createOrUpdateMediaItem();
                    }
                    else {
                        alert("Error status on upload!: " + requestObj.status);
                    }
                }
            }
            else {
                this.createOrUpdateMediaItem();
            }

            // return false to prevent form data submission by the browser
            return false;
        }

        // call the superclass once creation is done
        super.oncreate();
    }

    createOrUpdateMediaItem() {
        // handle the submit
        if (this.mediaItem.created) {
            this.mediaItem.update().then(() => {
                this.previousView({item: this.mediaItem}, "itemUpdated");
            });
        }
        else {
            this.mediaItem.create().then(() => {
                this.previousView({item: this.mediaItem}, "itemCreated");
            });
        }
    }

    constructor() {
        super();

        console.log("EditviewViewController()");
    }
}