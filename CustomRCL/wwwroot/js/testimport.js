import "./standard.js";
import "./chartiq.js";
import "./addOns.js";
import "./advanced.js"   /* loading this js fails */

export function TestInit(message) {
    return prompt(message, 'in TestInit function');
}