window.addEventListener("load", () => {
    const whiteboard = document.querySelector("#whiteboard");
    const ctx = whiteboard.getContext("2d");

    whiteboard.width = window.innerWidth * 0.59;
    whiteboard.height = window.innerHeight * 0.8;

    //whiteboard drawing functionality
    let drawing = false;
    ctx.lineWidth = 5;

    function getXY(canvas, event) {
        var rect = canvas.getBoundingClientRect(); // absolute position of mouse
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }

    function startPos(e) {
        drawing = true;
        draw(e);
    }

    function finishedPos() {
        drawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!drawing) return;
        ctx.lineCap = "round";
        let position = getXY(whiteboard, e)
        ctx.lineTo(position.x, position.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(position.x, position.y);
    }

    function changeColor(color) {
        ctx.strokeStyle = color.target.innerHTML;
    }

    function changeSize(size) {
        switch (size.target.innerHTML) {
            case "Small":
                ctx.lineWidth = 5;
                break;
            case "Medium":
                ctx.lineWidth = 10;
                break;
            case "Large":
                ctx.lineWidth = 15;
                break;
            case "Giant":
                ctx.lineWidth = 20;
                break;
        }
    }

    //buttons that control the whiteboard
    whiteboard.addEventListener("mousedown", startPos);
    whiteboard.addEventListener("mouseup", finishedPos);
    whiteboard.addEventListener("mousemove", draw);

    const red = document.getElementById("red");
    const orange = document.getElementById("orange");
    const yellow = document.getElementById("yellow");
    const green = document.getElementById("green");
    const blue = document.getElementById("blue");
    const purple = document.getElementById("purple");
    const black = document.getElementById("black");
    const colors = [red, orange, yellow, green, blue, purple, black];
    colors.forEach(x => addEventListener("click", changeColor, false));

    const small = document.getElementById("small");
    const medium = document.getElementById("medium");
    const large = document.getElementById("large");
    const giant = document.getElementById("very_large");
    const sizes = [small, medium, large, giant];
    sizes.forEach(x => addEventListener("click", changeSize, false));

    const eraser = document.getElementById("eraser").addEventListener("click", () => ctx.strokeStyle = "White", false);
    const clearAll = document.getElementById("clear_all").addEventListener("click", () => ctx.clearRect(0, 0, whiteboard.width, whiteboard.height), false);

    //importing the painting from the Smithsonian API + displaying it on webpage
    function randomNumber(n) {
        return Math.floor(Math.random() * n);
    }
    async function getPainting() {
        async function findImage() {
            let paintingArray = 'https://collectionapi.metmuseum.org/public/collection/v1/search?medium=Paintings&q=paintings'
            let responsep = await fetch(paintingArray);
            let datap = await responsep.json();
            let objectIDs = datap.objectIDs;

            let temp = api_url;
            temp = temp + "/" + objectIDs[randomNumber(objectIDs.length)].toString();
            let response = await fetch(temp);

            let data = await response.json();
            if (data.message === "ObjectID Not Found") { return findImage(); }

            let image = data.primaryImage;
            if (image == "" || image === undefined) { return findImage(); } else { return image; }
        }
        let src = await findImage();
        return src;
    }
    async function generatePainting() {
        let src = await getPainting();
        document.getElementById("art").src = src;
    }
    const api_url = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';
    generatePainting();

    //Randomize artwork
    const randomizer = document.getElementById("randomizer").addEventListener("click", generatePainting, false);

    //Print
    const print = document.getElementById("print");

    print.addEventListener("click", function () {

        var img = new Image();
        img.src = whiteboard.toDataURL(); //This method returns a data URI containing a representation of the image on canvas
        printWhiteboard(img.src);

        function printWhiteboard(imageSRC) {
            var newWindow = window.open(); //opens up a new window
            newWindow.document.open(); //opens the html page of the window
            newWindow.document.write(addHTML(imageSRC)); //adds html stuff to html page
            newWindow.document.close(); //Closes the html page 
        }

        function addHTML(imageSRC) {
            return "<html><head><scri" + "pt>function step1(){\n" +
                "setTimeout('step2()', 10);}\n" +
                "function step2(){window.print();window.close()}\n" +
                "</scri" + "pt></head><body onload='step1()'>\n" +
                "<img src='" + imageSRC + "' /></body></html>";
        }
    });

    //Social media links
    setShareLinks();

    function socialWindow(url) {
        var left_position = (screen.width - 570) / 2;
        var top_position = (screen.height - 570) / 2;
        var params = "menubar=no,toolbar=no,status=no,width=570,height=570,top=" + top_position + ",left=" + left_position;
        // Setting 'params' to an empty string will launch
        // content in a new tab or window rather than a pop-up.
        // params = "";
        window.open(url, "NewWindow", params); //opens a new window w/ specified url.
    }


    function setShareLinks() {
        var pageUrl = encodeURIComponent('https://johnlaidler267.github.io/ArtStudio/Studio.html');
        //var tweet = encodeURIComponent($("meta[property='og:description']").attr("content"));

        var facebook = document.getElementById("facebook");

        facebook.addEventListener("click", function () {
            var img = new Image();
            img.src = whiteboard.toDataURL(); //This method returns a data URI containing a representation of the image on canvas
            document.querySelector('meta[property="og:image"]').setAttribute("content", img.src);
            console.log(document.querySelector('meta[property="og:image"]'))
            url = "https://www.facebook.com/sharer.php?u=" + pageUrl;
            console.log(url);
            socialWindow(url);
        });
    }
});
