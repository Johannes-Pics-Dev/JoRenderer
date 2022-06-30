export default class Jo {
    static cache = {};

    static async render({ path, parent = document.getElementById("root"), locals = "", method = "replace" } = {}) {
        if (!(path in this.cache)) {
            await fetch(path + ".html")
                .then(response => response.text())
                .then(async (data) => {
                    this.cache[path] = data;
                    await this.replaceContent(parent, method, data, locals);
                });
        }
        else
            await this.replaceContent(parent, method, this.cache[path], locals);

    };


    static async replaceContent(parent, method, data, locals) {
        return new Promise(async (resolve, reject) => {
            for (let [k, v] of Object.entries(locals))
                data = data.replace("#" + k.toUpperCase() + "#", v);

            let scriptContent = data.match(/<script>(.|\n)*?<\/script>/g);
            if (scriptContent) {
                scriptContent = scriptContent[0].replace("<script>", "");
                scriptContent = scriptContent.replace("</script>", "");
                this.injectScript(scriptContent)
            }

            switch (method) {
                case "replace":
                    parent.innerHTML = data;
                    break;
                case "append":
                    var el = document.createElement('div');
                    el.innerHTML = data;
                    parent.appendChild(el)
                    break;
                case "prepend":
                    var el = document.createElement('div');
                    el.innerHTML = data;
                    parent.insertBefore(el, parent.firstChild);
                    break;
            }

            let partials = parent.querySelectorAll('div[data-partial]');
            for (let partial of partials) {
                let partial_path = partial.getAttribute("data-partial");
                await this.render({ path: partial_path, parent: partial });
            }
            resolve();
        });
    }

    static injectScript(content) {
        var script = document.createElement("script");
        script.innerHTML = content;
        document.body.appendChild(script);
    }

}