export default class Jo{
    static cache = {};

    static async render({path, parent, locals = "", method = "replace"} = {}) {
        if(!(path in this.cache)){
            await fetch(path+".html")
            .then(response => response.text())
            .then(data => {
                this.cache[path] = data;
                this.replaceContent (parent, method, data, locals);
            });
        }
        else
            await this.replaceContent (parent, method, this.cache[path], locals);
        
    };
    
    
    static replaceContent(parent, method, data, locals) {
        for(let [k,v] of Object.entries(locals))
            data = data.replace("#"+k.toUpperCase()+"#",v);
    
        switch(method) {
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
                parent.insertBefore(el,parent.firstChild);
            break;
        }
    
        let partials = parent.querySelectorAll('div[data-partial]');
        for(let partial of partials) {
            let partial_path = partial.getAttribute("data-partial");
            this.render({path: partial_path, parent: partial});
        }
    }
    
}