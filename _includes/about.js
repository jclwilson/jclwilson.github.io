<script>
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {         
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            clear();
            console.log(xmlHttp.responseText);
    }
    xmlHttp.open("GET", "README.md", true); // true for asynchronous 
    xmlHttp.send(null);
</script>
