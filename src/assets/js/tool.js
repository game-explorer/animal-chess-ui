/**
 * 获取url的query
 * @returns {a:1,b:2}
 */
export function getAllQuery() {
    let obj = {}
    let query = location.search.substring(1);
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (pair[0]) {
            obj[pair[0]] = pair[1]
        }
    }
    return obj
}