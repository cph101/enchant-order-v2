export class GeneralUtil {

    static formatString(template, ...args) {
        return template.replace(/{([0-9]+)}/g, function (match, index) {
          return typeof args[index] === 'undefined' ? match : args[index];
        });
      }

}