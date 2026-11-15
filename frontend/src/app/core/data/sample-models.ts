import { splitFlows, toPageModels } from '../../biodata/render/paginate';
import { buildRenderModel } from '../../biodata/render/render-model';
import { PageModel, RenderModel } from '../models/render.model';
import { SamplePersona, TemplateDefinition } from '../models/template.model';
import { sampleBiodata } from './samples';

const models = new Map<string, RenderModel>();

/** Render model of a sample profile, cached. Compact models fit one page for thumbnails. */
export function sampleRenderModel(persona: SamplePersona, compact = true): RenderModel {
  const key = `${persona}|${compact}`;
  let model = models.get(key);
  if (!model) {
    model = buildRenderModel(sampleBiodata(persona, compact));
    models.set(key, model);
  }
  return model;
}

/** A single unpaginated page of sample content for a design's thumbnail. */
export function samplePage(def: TemplateDefinition): { model: RenderModel; page: PageModel } {
  const model = sampleRenderModel(def.sample);
  const flows = splitFlows(model.blocks, def.side);
  return { model, page: toPageModels([flows.main], [flows.side])[0] };
}
