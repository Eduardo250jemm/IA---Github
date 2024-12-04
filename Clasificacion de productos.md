# Clasificación de Productos según su Aceptación por Clientes
 José Eduardo Martínez Melgoza -- 20120136
  

## Descripción del Problema
Una empresa desea predecir si un producto será aceptado o rechazado por los clientes basándose en las siguientes características:

- **Precio relativo:** Precio del producto en comparación con productos similares (normalizado entre 0 y 1).
- **Calidad percibida:** Opinión de los clientes sobre la calidad del producto en encuestas (normalizada entre 0 y 1).

### Criterios de Clasificación
Un producto se considera **aceptado** si cumple:
- El precio relativo es menor o igual a 0.6.
- La calidad percibida es mayor o igual a 0.7.

En caso contrario, será **rechazado**.

## Conjunto de Datos de Entrenamiento

| Precio relativo | Calidad percibida | Resultado |
|-----------------|-------------------|-----------|
| 0.5             | 0.8               | 1         |
| 0.6             | 0.9               | 1         |
| 0.7             | 0.6               | 0         |
| 0.4             | 0.5               | 0         |
| 0.3             | 0.9               | 1         |
| 0.8             | 0.4               | 0         |


### Ecuación del Perceptrón
$$
y = \text{step}(w_1 \cdot x_1 + w_2 \cdot x_2 + b)
$$

- **\(x_1\)**: En este caso indicara el precio relativo 
- **\(x_2\)**: Mienstras que esta variable indica la calidad percibida  
- **\(w_1, w_2\)**: Estos seran los pesos ajustables  
- **\(b\)**: Sesgo o las bias  
- **\(\text{step}(z)\)**: Función principal que devuelve 1 si \(z \geq 0\), de lo contrario, 0.



### Pesos y Sesgo Finales
- **\(w_1 = 0.0034\)**
- **\(w_2 = 0.1785\)**
- **\(b = -0.1155\)**

### Observaciones
- La frontera de decisión separa las clases aceptadas y rechazadas.
- Los datos parecen no ser perfectamente separables de forma lineal.

## Respuesta a Preguntas

### 1. ¿Son los datos linealmente separables?
Los datos no son linealmente separables, ya que algunos puntos están cerca de la frontera de decisión.

### 2. ¿Qué ajustes podrían mejorar la predicción?
- **Ajustar la tasa de aprendizaje (\(\eta\))** para optimizar la convergencia.
- **Aumentar las épocas de entrenamiento** para mejorar la separación.
- **Utilizar un perceptrón multicapa (MLP)** para abordar la posible no linealidad de los datos.

### 3. Encontrar los valores óptimos para los pesos `w1`, `w2` y el sesgo `b` mediante entrenamiento
Después de entrenar el modelo durante varias épocas, los valores finales encontrados son:

- **Peso \(w_1\)**: 0.0034  
- **Peso \(w_2\)**: 0.1785  
- **Sesgo \(b\)**: -0.1155

Estos valores permiten que el perceptrón clasifique los productos según los criterios establecidos.

### 4. Graficar la frontera de decisión que separa los productos aceptados de los rechazados
La frontera de decisión se define por la ecuación:

$$
w_1 \cdot x_1 + w_2 \cdot x_2 + b = 0
$$

La gráfica muestra una línea que separa los productos aceptados y rechazados, con los puntos representando los datos de entrenamiento.

### 5. ¿Son los datos linealmente separables?
No, los datos no son completamente linealmente separables. Algunos puntos están cerca de la frontera de decisión, lo que dificulta una separación perfecta con un modelo lineal simple.

### 6. ¿Qué ajustes podrían hacer al modelo para mejorar la predicción?
1. **Modificar la tasa de aprendizaje (\(\eta\))** para mejorar la velocidad y precisión del entrenamiento.
2. **Incrementar el número de épocas** para permitir una mejor convergencia.
3. **Usar un perceptrón multicapa (MLP)** para manejar datos no linealmente separables.
4. **Añadir más características** relacionadas que puedan mejorar la capacidad de clasificación.
5. **Aplicar una función de activación no lineal**, como ReLU o sigmoide, para modelar relaciones más complejas.
