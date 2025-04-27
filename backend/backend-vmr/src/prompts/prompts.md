LLM: Claude-3.7-sonnet

prompt1: Como especialista en desarrollo, quiero validar si la base de datos está preparada. Para ello, primero quiero evaluar si tengo la información del nombre completo del candidato, en qué fase del proyecto se encuentra el candidato y cuál es su puntuación media.

prompt2: ¿Cuáles son las posibles fases en las que puede estar el candidato?

prompt3: ¿Tengo algún SQL que indique cuáles son las fases?

prompt4: Como especialista en desarrollo de software, quiero crear un endpoint con la siguiente información: nombre completo del candidato, fase del proyecto del candidato y puntuación media del candidato. Quiero que me presentes los cambios para que pueda ir aprobándolos. El endpoint debe respetar esta llamada: GET /positions/:id/candidates.

prompt5: Por favor, genera un curl para que pueda probar este endpoint.

prompt6: Ahora surgió otro error con el puerto 3010.

prompt7: Ahora que tenemos el endpoint, como especialista en frontend, quiero crear una nueva pantalla en formato kanban. Cada columna del kanban debe respetar el currentStep. En cada columna debo mostrar una tarjeta al estilo kanban, con el nombre completo y la puntuación media del candidato. Para estos datos, debo utilizar el endpoint ya creado.

prompt8: Siguiendo todos los estándares hasta ahora, quiero crear un nuevo endpoint donde pueda actualizar la etapa del candidato. Ejemplo: PUT /candidates/:id/stage.

prompt9: Como especialista en frontend, ahora que tenemos el endpoint /candidates/:id/stage donde puedo actualizar el currentStep, quiero ajustar la interfaz para que pueda mover las tarjetas dentro de cada columna del kanban, de modo que el sistema actualice el currentStep y muestre la tarjeta en la nueva columna.

prompt10: Como sugeriste, ajustemos el error creando un servicio para obtener dinámicamente el mapeo de candidatos y eliminar el mapeo hardcodeado.