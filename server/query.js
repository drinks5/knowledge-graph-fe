// const GraknClient = require("grakn-client");
// import { GraknClient } from 'grakn-client'
import GraknClient from 'grakn-client'
// const CDB = import('./cdb.js')
import { buildInstances, buildTypes, buildRPInstances } from './cdb.js'
// const { computeAttributes } = require("src/renderer/components/SchemaDesign/SchemaUtils");
async function runBasicQueries(keyspace) {
	const client = new GraknClient("localhost:48555");
	const session = await client.session(keyspace);
	const readTransaction = await session.transaction().read();

	// We can either query and consume the iterator lazily
	let answerIterator = await readTransaction.query("match $x isa person; get; limit 10;");
	let aConceptMapAnswer = await answerIterator.next();
	while (aConceptMapAnswer != null) {
		// get the next `x`
		const person = aConceptMapAnswer.map().get("x");
		console.log("Retrieved person with id " + person.id);
		aConceptMapAnswer = await answerIterator.next();
	}

	// Or query and consume the iterator immediately collecting all the results
	answerIterator = await readTransaction.query("match $x isa person; get; limit 10;");
	const persons = await answerIterator.collectConcepts();
	persons.forEach(person => { console.log("Retrieved person with id " + person.id) });

	// a read transaction must always be closed
	await readTransaction.close();
	// a session must always be closed
	await session.close();
	// a client must always be closed
	client.close();
}

async function computeAttributes(nodes, graknTx) {
	const concepts = await Promise.all(nodes.map(node => graknTx.getConcept(node.id)));
	const attrIters = await Promise.all(concepts.map(concept => concept.attributes()));
	const attrGroups = await Promise.all(attrIters.map(iter => iter.collect()));

	return Promise.all(attrGroups.map(async (attrGroup, i) => {
		nodes[i].attributes = await Promise.all(attrGroup.map(attr => new Promise((resolve) => {
			const attribute = {};
			if (attr.isType()) {
				attr.label().then((label) => {
					attribute.type = label;
					resolve(attribute);
				});
			} else {
				attr.type().then(type => type.label()).then((label) => {
					attribute.type = label;
					attr.value().then((value) => {
						attribute.value = value;
						resolve(attribute);
					});
				});
			}
		})));
		return nodes[i];
	}));
}
export async function RUN_CURRENT_QUERY(keyspace) {
	const client = new GraknClient("localhost:48555");
	const session = await client.session(keyspace);
	const graknTx = await session.transaction().read();
	const query = "match $x isa person; get; offset 0; limit 3;";
	console.log(query);
	const result = await (await graknTx.query(query, { explain: true })).collect();
	if (!result.length) {
		commit('loadingQuery', false);
		return null;
	}

	const queryTypes = {
		GET: 'get',
		PATH: 'compute path',
	};

	// eslint-disable-next-line no-prototype-builtins
	const queryType = (result[0].hasOwnProperty('map') ? queryTypes.GET : queryTypes.PATH);

	let nodes = [];
	const edges = [];
	if (queryType === queryTypes.GET) {
		const shouldLoadRPs = true;
		const shouldLimit = true;

		const instancesData = await buildInstances(result, query);
		nodes.push(...instancesData.nodes);
		edges.push(...instancesData.edges);

		const typesData = await buildTypes(result);
		nodes.push(...typesData.nodes);
		edges.push(...typesData.edges);

		const rpData = await buildRPInstances(result, { nodes, edges }, shouldLimit, graknTx);
		nodes.push(...rpData.nodes);
		edges.push(...rpData.edges);
	}

	nodes = await computeAttributes(nodes, graknTx);

	return { nodes, edges };
};
// RUN_CURRENT_QUERY("social_network");