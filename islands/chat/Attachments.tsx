export default function Attachments() {
    return (
        <div class="attachments">
            <div class="actions actions-container">
                <div class="actions">
                    <button class="new">New +</button>
                    <button>Select</button> {/**Select, Deselect, Select All */}

                    <div class="actions">
                        <button>Select All</button>
                        <button>Download</button>
                        <button>Share</button>
                    </div>
                </div>

                <div class="actions">
                    <button>Report</button>
                    <button>Delete</button>
                </div>
            </div>

            <div class="items">
                <div class="items-container">

                    <div class="attachment-card">
                        <div class="attachment-image">
                            <img src="https://blog.adobe.com/en/publish/2024/10/14/media_1ca79b205381242c5f8beaaee2f0e1cfb2aa8f324.png?width=750&format=png&optimize=medium"/>
                        </div>

                        <div class="attachment-details">
                            <p class="title">Title</p>
                            <p class="date">Date</p>
                        </div>
                    </div>

                </div>
            </div>

            <div class="preview">
                <div class="preview-image">
                    <img src="https://blog.adobe.com/en/publish/2024/10/14/media_1ca79b205381242c5f8beaaee2f0e1cfb2aa8f324.png?width=750&format=png&optimize=medium"/>
                </div>

                <div class="preview-info">
                    <div class="obj-info">
                        <h5 class="title">Title</h5>
                        <p class="obj-type">PNG Image</p>
                        <p class="sent-at">Date Time</p>
                    </div>
                    <hr/>
                    <div class="message-info">
                        <button class="goto">Go to message</button>
                        <p class="msg">message</p>
                    </div>
                </div> 

                <div class="preview-actions">
                    <ul>
                        <li class="open"><button>Open</button></li>
                        <li><button>Download</button></li>
                        <li><button>Copy Link</button></li>
                        <li><button>Share</button></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}