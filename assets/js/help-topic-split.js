
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

    const resetChildSelect = () => {
        childSelect.innerHTML = "";
        childSelect.appendChild(
            new Option("Seleccione un subtema", "")
        );
    };

    const syncOriginalSelect = (value) => {
        topicSelect.value = value || "";

        if (window.jQuery) {
            window.jQuery(topicSelect).trigger("change");
        } else {
            topicSelect.dispatchEvent(new Event("change"));
        }
    };

    const populateChildSelect = (parentId) => {
        resetChildSelect();

        const childTopics = children[parentId] || [];
        childTopics.forEach(child => {
            childSelect.appendChild(
                new Option(child.name, child.id)
            );
        });
    };

    parentSelect.addEventListener("change", function () {
        if (!this.value) {
            resetChildSelect();
            syncOriginalSelect("");
            return;
        }

        populateChildSelect(this.value);
        syncOriginalSelect("");
    });

    childSelect.addEventListener("change", function () {
        syncOriginalSelect(this.value);

        if (!this.value) {
            console.info('HelpTopicSplit: subtema deseleccionado, campo original reiniciado.');
            return;
        }

        console.log("Subtema seleccionado:", this.value);
    });

    // Seleccionar valores iniciales si hay uno presente
    if (originalValue) {
        const currentParent = Object.keys(children).find(parentId =>
            children[parentId].some(child => child.id === originalValue)
        );

        if (currentParent) {
            parentSelect.value = currentParent;
            populateChildSelect(currentParent);
            childSelect.value = originalValue;
        }
    }

    // Ocultar selector original solo después de preparar los nuevos controles.
    topicSelect.style.display = "none";
};
window.addEventListener("load", function () {
    initializeHelpTopicSplit();
});