import { Command } from 'commander';
import { getHAClient } from '../utils/ha-client.js';
import * as output from '../utils/output.js';

export function createScenesCommand(): Command {
  const scenes = new Command('scenes')
    .description('Manage HomeAssistant scenes');

  scenes
    .command('list')
    .description('List all scenes')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Fetching scenes...');
        const client = getHAClient();
        const states = await client.getStates();
        const sceneStates = states.filter(e => e.entity_id.startsWith('scene.'));
        spin.stop();

        if (options.json) {
          output.outputJSON(sceneStates);
          return;
        }

        output.header(`Scenes (${sceneStates.length})`);
        const table = output.createTable(['Entity ID', 'Name']);
        sceneStates.forEach(scene => {
          table.push([
            output.truncate(scene.entity_id, 40),
            output.truncate(scene.attributes.friendly_name || scene.entity_id, 40)
          ]);
        });
        output.printTable(table);
      } catch (error: any) {
        output.error(`Failed to list scenes: ${error.message}`);
        process.exit(1);
      }
    });

  scenes
    .command('activate')
    .description('Activate a scene')
    .argument('<scene_id>', 'Scene entity ID')
    .option('--transition <seconds>', 'Transition duration')
    .action(async (sceneId, options) => {
      try {
        const data: any = { entity_id: sceneId };
        
        if (options.transition) {
          data.transition = parseFloat(options.transition);
        }

        const spin = output.spinner(`Activating ${sceneId}...`);
        const client = getHAClient();
        await client.callService('scene', 'turn_on', data);
        spin.succeed(`Activated ${sceneId}`);
      } catch (error: any) {
        output.error(`Failed to activate scene: ${error.message}`);
        process.exit(1);
      }
    });

  scenes
    .command('create')
    .description('Create a scene from current state')
    .argument('<scene_id>', 'Scene entity ID (e.g., scene.my_scene)')
    .option('--entities <entity_ids>', 'Comma-separated entity IDs to include')
    .option('--snapshot', 'Snapshot all entities in current state')
    .action(async (sceneId, options) => {
      try {
        if (!options.entities && !options.snapshot) {
          output.error('Must specify --entities or --snapshot');
          process.exit(1);
        }

        const data: any = { scene_id: sceneId };
        
        if (options.entities) {
          const entityIds = options.entities.split(',').map((id: string) => id.trim());
          
          const spin = output.spinner('Fetching entity states...');
          const client = getHAClient();
          const states = await client.getStates();
          spin.stop();
          
          const entities: any = {};
          for (const entityId of entityIds) {
            const entity = states.find(e => e.entity_id === entityId);
            if (entity) {
              entities[entityId] = {
                state: entity.state,
                ...entity.attributes
              };
            }
          }
          
          data.snapshot_entities = entityIds;
        }

        const createSpin = output.spinner(`Creating scene ${sceneId}...`);
        const client = getHAClient();
        await client.callService('scene', 'create', data);
        createSpin.succeed(`Created scene ${sceneId}`);
        
        output.info('Scene created successfully');
      } catch (error: any) {
        output.error(`Failed to create scene: ${error.message}`);
        process.exit(1);
      }
    });

  return scenes;
}
