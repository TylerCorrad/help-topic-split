
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

    const script = document.currentScript ||
        document.querySelector('script[src*="help-topic-split.js"]');

    const url = script && script.src
        ? new URL('../../ajax/topics.php', script.src).href
        : new URL('ajax/topics.php', window.location.href).href;

    try {
        const response = await fetch(url, { credentials: 'same-origin' });

        if (!response.ok) {
            throw new Error('No se pudieron cargar los temas: ' + response.status);
        }

        return await response.json();
    } catch (err) {
        console.error('HelpTopicSplit: error cargando temas', err);
        return null;
    }
}

async function initializeHelpTopicSplit() {

    const topics = await getTopics();
    if (!topics || typeof topics !== 'object' || !Object.keys(topics).length) {
        console.warn('HelpTopicSplit: no se obtuvo una lista de temas válida, manteniendo el selector original.');
        return;
    }

    const { parents, children } = buildHierarchy(topics);

    const topicSelect = document.querySelector('select[name="topicId"]');

    if (!topicSelect) {
        console.warn('HelpTopicSplit: no se encontró topicId');
        return;
    }

    const originalValue = topicSelect.value;

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

    if (document.getElementById("help-topic-wrapper")) {
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.id = "help-topic-wrapper";

    wrapper.appendChild(parentSelect);
    wrapper.appendChild(childSelect);

    const container = topicSelect.parentNode;
    container.appendChild(wrapper);

    // Llenar temas principales desde la jerarquía real
    Object.entries(parents).forEach(([id, topic]) => {
        parentSelect.appendChild(
            new Option(topic.topic, id)
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