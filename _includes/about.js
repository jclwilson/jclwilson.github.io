<script>
    var jsget = new XMLHttpRequest();
    jsget.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(jsget.responseText);
        }
    };
    jsget.open("GET", "README.md", true);
</script>
