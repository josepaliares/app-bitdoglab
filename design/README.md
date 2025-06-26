# Design System — Light Mode

## Introdução

Este documento apresenta o Design System do projeto, detalhando a paleta tonal e o mapeamento de tokens para o tema claro (**Light Mode**).  
As cores são organizadas em design tokens, facilitando manutenção, consistência visual e integração entre design e desenvolvimento.

---

## Paleta Tonal (Invertida)

| Paleta      | 10       | 20       | 30       | 40       | 50       |
|-------------|----------|----------|----------|----------|----------|
| **Primary**   | #162F3E  | #244B64  | #3F84AF  | #5D9DC4  | #A8CADF  |
| **Secondary** | #720D46  | #A01262  | #E31A8B  | #ED54AA  | #F7BADD  |
| **Neutral**   | #000000  | #4D4D4D  | #8A8A8A  | #E6E6E6  | #FFFFFF  |

---

## Tokens do Light Mode

Cada token é um estilo nomeado que deve ser criado no Figma e utilizado no código para máxima consistência.

| Token Name                       | Valor (Hex) | De onde vem    | Uso recomendado                                   |
|-----------------------------------|-------------|----------------|---------------------------------------------------|
| `theme/light/primary`             | #3F84AF     | Primary 30     | Cor principal, botões, links, destaques           |
| `theme/light/on-primary`          | #FFFFFF     | Neutral 50     | Texto/icon sobre fundo `primary`                  |
| `theme/light/primary-container`   | #A8CADF     | Primary 50     | Fundo de elementos destacados, cards, chips       |
| `theme/light/on-primary-container`| #244B64     | Primary 20     | Texto/icon sobre `primary-container`              |
| `theme/light/secondary`           | #E31A8B     | Secondary 30   | Botões secundários, elementos de apoio            |
| `theme/light/on-secondary`        | #FFFFFF     | Neutral 50     | Texto/icon sobre fundo `secondary`                |
| `theme/light/secondary-container` | #F7BADD     | Secondary 50   | Fundo de alertas, cartões secundários             |
| `theme/light/on-secondary-container`| #A01262   | Secondary 20   | Texto sobre `secondary-container`                 |
| `theme/light/background`          | #FFFFFF     | Neutral 50     | Fundo geral da interface                          |
| `theme/light/surface`             | #E6E6E6     | Neutral 40     | Fundo de cards, modais, menus                     |
| `theme/light/on-surface`          | #4D4D4D     | Neutral 20     | Texto sobre `surface`                             |
| `theme/light/error`               | #ED54AA     | Secondary 40   | Mensagens de erro, avisos                         |
| `theme/light/on-error`            | #FFFFFF     | Neutral 50     | Texto sobre erro                                  |
| `theme/light/border`              | #000000     | Neutral 20     | Bordas e divisores                                |
| `theme/light/heading`             | #000000     | Neutral 10     | Títulos principais                                |
| `theme/light/text`                | #000000     | Neutral 30     | Texto comum, legendas, parágrafos                 |
| `theme/light/hover`               | #244B64     | Primary 20     | Hover em botões primários                         |
| `theme/light/hover-secondary`     | #A01262     | Secondary 20   | Hover em botões secundários                       |

---# BitDogLab Design System 