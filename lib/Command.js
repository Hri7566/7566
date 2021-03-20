module.exports = class Command {
    /**
     * 
     * @param {string} name Name of command
     * @param {function} func Function to run when command is called
     * @param {string} example Example of what command does
     * @param {number} minArgs Minimum arguments required to run callback
     * @param {number} minRank Minimum rank ID required to run callback
     * @param {boolean} hidden Whether or not to show command in help menu
     * @param {object} aliases Array<string> of other ways to access command
     */
    constructor (name, func, example, minArgs, minRank, hidden, aliases) {
        this.name = name;
        this.func = func;
        this.example = example;
        this.minimumArguments = minArgs;
        this.minimumRank = minRank;
        this.hidden = hidden;
        this.aliases = aliases;
    }

    static getExample(cmd, prefix) {
        if (typeof(prefix) !== 'string') return;
        return cmd.example.split("PREFIX").join(prefix);
    }
}
