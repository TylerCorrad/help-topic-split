
function buildHierarchy(topics) {

    const parents = {};
    const children = {};

    Object.entries(topics).forEach(([id, topic]) => {

        if (topic.pid == 0) {

            parents[id] = topic;
            children[id] = [];

        } else {

            if (!children[topic.pid]) {
                children[topic.pid] = [];
            }

            const parentName = parents[topic.pid]?.topic || '';
            let childName = topic.topic;

            if (parentName &&
                childName.startsWith(parentName + ' / ')) {

                childName =
                    childName.substring(
                        parentName.length + 3
                    );
            }

            children[topic.pid].push({
                id: id,
                name: childName
            });

        }

    });

    return {
        parents,
        children
    };
}

async function getTopics() {

    const response = await fetch(
        '/upload/include/plugins/help-topic-split/ajax/topics.php'
    );

    return await response.json();
}

async function initializeHelpTopicSplit() {

    const topics = await getTopics();
    const { parents, children } = buildHierarchy(topics);

    const topicSelect = document.querySelector('select[name="topicId"]');

        if (!topicSelect) {
            console.log("No se encontró topicId");
            return;
        }

        console.log("TopicId encontrado");

        // Ocultar selector original
        topicSelect.style.display = "none";

        // Crear selector de temas principales
        const parentSelect = document.createElement("select");
        parentSelect.id = "help-topic-parent";
        parentSelect.style.width = "50%";
        parentSelect.style.marginBottom = "10px";

        parentSelect.appendChild(
            new Option("Seleccione un tema", "")
        );

        // Crear selector de subtemas
        const childSelect = document.createElement("select");
        childSelect.id = "help-topic-child";
        childSelect.style.width = "50%";
        childSelect.style.marginBottom = "10px";

        childSelect.appendChild(
            new Option("Seleccione un subtema", "")
        );

        // Insertar controles
        
        if (document.getElementById("help-topic-wrapper"))
            return;

        const wrapper = document.createElement("div");
        wrapper.id = "help-topic-wrapper";

        wrapper.appendChild(parentSelect);
        wrapper.appendChild(childSelect);
        
        const container = topicSelect.parentNode;

        container.appendChild(wrapper);


        // Llenar temas principales desde la jerarquía real
        Object.entries(parents).forEach(([id, topic]) => {

            parentSelect.appendChild(
                new Option(
                    topic.topic,
                    id
                )
            );

        });


        // Cambio de tema principal
        parentSelect.addEventListener("change", function () {

            childSelect.innerHTML = "";

            childSelect.appendChild(
                new Option("Seleccione un subtema", "")
            );
            
            const childTopics =
                children[this.value] || [];

            childTopics.forEach(child => {


                childSelect.appendChild(
                    new Option(
                        child.name,
                        child.id
                    )
                );
            });

        });

        // Cambio de subtema
        childSelect.addEventListener("change", function () {

            if (!this.value)
                return;

            topicSelect.value = this.value;

            // Mantener comportamiento AJAX original
            if (window.jQuery) {
                window.jQuery(topicSelect).trigger("change");
            } else {
                topicSelect.dispatchEvent(
                    new Event("change")
                );
            }

            console.log(
                "Subtema seleccionado:",
                this.value
            );

        });

    };
window.addEventListener("load", function () {
    initializeHelpTopicSplit();
});